package com.supermarket.management.service;

import com.supermarket.management.entity.OrderDetail;
import com.supermarket.management.repository.OrderDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderDetailService {

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    public List<OrderDetail> getAllOrderDetails() {return orderDetailRepository.findAll();}

    public List<OrderDetail> getAllOrderDetailsSortedAsc() {return orderDetailRepository.findAllByOrderByOrderIdAsc();}

    public List<OrderDetail> getAllOrderDetailsSortedDesc() {return orderDetailRepository.findAllByOrderByOrderIdDesc();}

    public List<OrderDetail> getAllOrderDetailsSortedByTotalPriceAsc() {return orderDetailRepository.findAllByOrderByTotalPriceAsc();}

    public List<OrderDetail> getAllOrderDetailsSortedByTotalPriceDesc() {return orderDetailRepository.findAllByOrderByTotalPriceDesc();}

    public List<OrderDetail> searchOrderDetails(Integer orderId, Integer productId) {
        return orderDetailRepository.searchOrderDetails(orderId, productId);
    }
}
